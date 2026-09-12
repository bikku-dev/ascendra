package ascendra_backend.matching.service;

import ascendra_backend.matching.dto.MentorMatchResponse;

import java.util.List;

public interface MentorMatchingService {

    List<MentorMatchResponse> findMentorsForGoal(
            Long goalId
    );
}