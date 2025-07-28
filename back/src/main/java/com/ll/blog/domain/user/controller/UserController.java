package com.ll.blog.domain.user.controller;

import com.ll.blog.domain.email.service.EmailVerificationService;
import com.ll.blog.domain.user.dto.DeleteUserRequest;
import com.ll.blog.domain.user.dto.LoginRequest;
import com.ll.blog.domain.user.dto.SignUpRequest;
import com.ll.blog.domain.user.service.UserService;
import com.ll.blog.global.response.StandardApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final EmailVerificationService emailVerificationService;

    //    회원가입
    @PostMapping("/signup")
    public ResponseEntity<StandardApiResponse<Void>> signup(@RequestBody SignUpRequest request) {
        try {
            userService.signup(request);
            return ResponseEntity.ok(StandardApiResponse.success("회원가입 완료"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(StandardApiResponse.error(e.getMessage()));
        }
    }

    //    로그인
    @PostMapping("/login")
    public ResponseEntity<StandardApiResponse<String>> login(@RequestBody LoginRequest request) {
        String token = userService.login(request);
        return ResponseEntity.ok(StandardApiResponse.success("로그인 성공", token));
    }

//    이메일 전송용 컨트롤러
    @PostMapping("/me/request-verification-code")
    public ResponseEntity<StandardApiResponse<Void>> sendDeleteVerificationCode() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName(); // username이 email이라고 가정
        emailVerificationService.sendVerificationEmail(email);
        return ResponseEntity.ok(StandardApiResponse.success("탈퇴 인증번호 전송 완료"));
    }

//    탈퇴
    @DeleteMapping("/me")
    public ResponseEntity<StandardApiResponse<Void>> deleteUser(@RequestBody DeleteUserRequest request) {
        userService.deleteCurrentUser(request.getCode());
        return ResponseEntity.ok(StandardApiResponse.success("회원 탈퇴가 완료되었습니다."));
    }
}