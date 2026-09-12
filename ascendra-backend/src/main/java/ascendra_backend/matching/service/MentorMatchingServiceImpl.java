package ascendra_backend.matching.service;

import ascendra_backend.expert.entity.ExpertProfile;
import ascendra_backend.expert.entity.ExpertSkill;
import ascendra_backend.expert.repository.ExpertProfileRepository;
import ascendra_backend.expert.repository.ExpertSkillRepository;
import ascendra_backend.goal.entity.GoalSkill;
import ascendra_backend.goal.repository.GoalRepository;
import ascendra_backend.goal.repository.GoalSkillRepository;
import ascendra_backend.learner.entity.LearnerSkill;
import ascendra_backend.learner.repository.LearnerSkillRepository;
import ascendra_backend.matching.dto.MentorMatchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MentorMatchingServiceImpl
        implements MentorMatchingService {

    private final GoalRepository goalRepository;

    private final GoalSkillRepository goalSkillRepository;

    private final LearnerSkillRepository learnerSkillRepository;

    private final ExpertSkillRepository expertSkillRepository;

    private final ExpertProfileRepository expertProfileRepository;


    @Override
    public List<MentorMatchResponse> findMentorsForGoal(
            Long goalId) {

        // 1. Check goal
        var goal =
                goalRepository.findById(goalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Goal not found with id: "
                                                + goalId
                                )
                        );


        // 2. Get required skills for goal
        List<GoalSkill> goalSkills =
                goalSkillRepository.findByGoalId(
                        goalId
                );


        if (goalSkills.isEmpty()) {

            throw new RuntimeException(
                    "No required skills found for this goal"
            );
        }


        // 3. Get learner's current skills
        Long learnerId =
                goal.getLearner().getId();

        List<LearnerSkill> learnerSkills =
                learnerSkillRepository.findByLearnerId(
                        learnerId
                );


        // Map:
        // skillId -> current level
        Map<Long, Integer> learnerSkillMap =
                new HashMap<>();

        for (LearnerSkill learnerSkill : learnerSkills) {

            learnerSkillMap.put(
                    learnerSkill.getSkill().getId(),
                    learnerSkill.getSkillLevel()
            );
        }


        // 4. Get all experts
        List<ExpertProfile> experts =
                expertProfileRepository.findAll();


        List<MentorMatchResponse> matches =
                new ArrayList<>();


        // 5. Check every expert
        for (ExpertProfile expert : experts) {

            if (!Boolean.TRUE.equals(
                    expert.getAvailable()
            )) {
                continue;
            }


            List<ExpertSkill> expertSkills =
                    expertSkillRepository.findByExpertId(
                            expert.getId()
                    );


            if (expertSkills.isEmpty()) {
                continue;
            }


            // Expert skill map
            Map<Long, Integer> expertSkillMap =
                    new HashMap<>();

            for (ExpertSkill expertSkill :
                    expertSkills) {

                expertSkillMap.put(
                        expertSkill.getSkill().getId(),
                        expertSkill.getSkillLevel()
                );
            }


            double totalScore = 0.0;

            int matchedSkills = 0;


            // 6. Compare GoalSkill with ExpertSkill
            for (GoalSkill goalSkill :
                    goalSkills) {

                Long skillId =
                        goalSkill.getSkill().getId();

                Integer requiredLevel =
                        goalSkill.getRequiredLevel();

                Integer expertLevel =
                        expertSkillMap.get(skillId);

                Integer learnerLevel =
                        learnerSkillMap.getOrDefault(
                                skillId,
                                0
                        );


                if (expertLevel == null) {
                    continue;
                }


                // Mentor should at least meet
                // required skill level
                if (expertLevel < requiredLevel) {
                    continue;
                }


                matchedSkills++;


                /*
                 * Calculate learner gap.
                 *
                 * Example:
                 *
                 * Required = 80
                 * Learner  = 40
                 *
                 * Gap = 40
                 */
                int learnerGap =
                        Math.max(
                                requiredLevel - learnerLevel,
                                0
                        );


                /*
                 * If learner already knows
                 * the required level, give full score.
                 */
                if (learnerGap == 0) {

                    totalScore += 100;

                } else {

                    /*
                     * Mentor's expertise compared
                     * with required level.
                     */
                    double mentorStrength =
                            ((double) expertLevel
                                    / requiredLevel)
                                    * 100;

                    mentorStrength =
                            Math.min(
                                    mentorStrength,
                                    100
                            );

                    totalScore += mentorStrength;
                }
            }


            // 7. Calculate final score
            double matchScore =
                    (totalScore / goalSkills.size());


            // 8. Only useful mentors
            if (matchedSkills > 0) {

                matches.add(
                        MentorMatchResponse.builder()
                                .expertId(
                                        expert.getId()
                                )
                                .userId(
                                        expert.getUser().getId()
                                )
                                .mentorName(
                                        expert.getUser()
                                                .getName()
                                )
                                .professionalTitle(
                                        expert.getProfessionalTitle()
                                )
                                .bio(
                                        expert.getBio()
                                )
                                .experienceYears(
                                        expert.getExperienceYears()
                                )
                                .hourlyRate(
                                        expert.getHourlyRate()
                                )
                                .rating(
                                        expert.getRating()
                                )
                                .matchScore(
                                        Math.round(
                                                matchScore * 100
                                        ) / 100.0
                                )
                                .matchedSkills(
                                        matchedSkills
                                )
                                .totalRequiredSkills(
                                        goalSkills.size()
                                )
                                .available(
                                        expert.getAvailable()
                                )
                                .build()
                );
            }
        }


        // 9. Best mentor first
        matches.sort(
                Comparator.comparing(
                        MentorMatchResponse::getMatchScore
                ).reversed()
        );


        return matches;
    }
}