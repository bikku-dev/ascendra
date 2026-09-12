package ascendra_backend.skill.service;

import ascendra_backend.skill.dto.SkillRequest;
import ascendra_backend.skill.dto.SkillResponse;
import ascendra_backend.skill.entity.Skill;
import ascendra_backend.skill.mapper.SkillMapper;
import ascendra_backend.skill.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class SkillServiceImpl
        implements SkillService {


    private final SkillRepository skillRepository;

    private final SkillMapper skillMapper;


    /*
     * =========================================================
     * CREATE SKILL
     * =========================================================
     */

    @Override
    public SkillResponse createSkill(
            SkillRequest request) {

        String name =
                request.getName()
                        .trim();

        String category =
                request.getCategory()
                        .trim();


        /*
         * Same skill dobara create nahi hogi.
         */

        if (skillRepository
                .existsByNameIgnoreCase(name)) {

            throw new RuntimeException(
                    "Skill already exists: " + name
            );
        }


        Skill skill =
                Skill.builder()
                        .name(name)
                        .category(category)
                        .build();


        Skill savedSkill =
                skillRepository.save(skill);


        return skillMapper.toResponse(
                savedSkill
        );
    }


    /*
     * =========================================================
     * GET ALL SKILLS
     *
     * LearnerOnboarding.jsx isko call karega.
     *
     * Example:
     *
     * GET /api/skills
     *
     * Response:
     *
     * [
     *   {
     *      "id": 1,
     *      "name": "Java",
     *      "category": "Backend"
     *   },
     *   {
     *      "id": 2,
     *      "name": "React",
     *      "category": "Frontend"
     *   }
     * ]
     *
     * =========================================================
     */

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponse> getAllSkills() {

        return skillRepository
                .findAll()
                .stream()
                .map(skillMapper::toResponse)
                .toList();
    }


    /*
     * =========================================================
     * GET SKILL BY ID
     * =========================================================
     */

    @Override
    @Transactional(readOnly = true)
    public SkillResponse getSkillById(
            Long id) {

        Skill skill =
                skillRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Skill not found with id: "
                                                + id
                                )
                        );

        return skillMapper.toResponse(
                skill
        );
    }


    /*
     * =========================================================
     * UPDATE SKILL
     * =========================================================
     */

    @Override
    public SkillResponse updateSkill(
            Long id,
            SkillRequest request) {

        Skill skill =
                skillRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Skill not found with id: "
                                                + id
                                )
                        );


        String newName =
                request.getName()
                        .trim();

        String newCategory =
                request.getCategory()
                        .trim();


        /*
         * Check duplicate name.
         *
         * Agar kisi doosri skill ke paas same name hai
         * to update allow nahi hoga.
         */

        if (!skill.getName()
                .equalsIgnoreCase(newName)
                &&
                skillRepository
                        .existsByNameIgnoreCase(newName)) {

            throw new RuntimeException(
                    "Skill already exists: "
                            + newName
            );
        }


        skill.setName(newName);

        skill.setCategory(
                newCategory
        );


        Skill updatedSkill =
                skillRepository.save(skill);


        return skillMapper.toResponse(
                updatedSkill
        );
    }


    /*
     * =========================================================
     * DELETE SKILL
     * =========================================================
     */

    @Override
    public void deleteSkill(
            Long id) {

        Skill skill =
                skillRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Skill not found with id: "
                                                + id
                                )
                        );


        skillRepository.delete(skill);
    }
}