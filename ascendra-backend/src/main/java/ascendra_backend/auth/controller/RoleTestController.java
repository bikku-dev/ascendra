package ascendra_backend.auth.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoleTestController {

    @GetMapping("/api/learner/test")
    public String learnerTest(
            Authentication authentication) {

        return "LEARNER API ACCESS GRANTED - "
                + authentication.getName();
    }

    @GetMapping("/api/expert/test")
    public String expertTest(
            Authentication authentication) {

        return "EXPERT API ACCESS GRANTED - "
                + authentication.getName();
    }

    @GetMapping("/api/admin/test")
    public String adminTest(
            Authentication authentication) {

        return "ADMIN API ACCESS GRANTED - "
                + authentication.getName();
    }
}