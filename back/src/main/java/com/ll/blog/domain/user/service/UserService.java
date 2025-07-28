package com.ll.blog.domain.user.service;

import com.ll.blog.domain.email.service.EmailVerificationService;
import com.ll.blog.domain.user.dto.LoginRequest;
import com.ll.blog.domain.user.dto.SignUpRequest;
import com.ll.blog.domain.user.entity.Users;
import com.ll.blog.domain.user.repository.UserRepository;
import com.ll.blog.global.jwt.JwtProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // 의존성 주입
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final EmailVerificationService emailVerificationService;

    //    회원가입 로직
    public void signup(SignUpRequest request) {
//        이메일 인증 코드 확인
        boolean isVerified = emailVerificationService.verifyCode(request.getUsername(), request.getCode());
        if (!isVerified) {
            throw new IllegalArgumentException("이메일 인증에 실패했습니다. 올바른 인증 코드를 입력해주세요.");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 사용중인 이메일입니다.");
        }

        if (userRepository.existsByNickname(request.getNickname())) {
            throw new IllegalArgumentException("이미 사용중인 닉네임입니다.");
        }

        Users user = Users.builder()
                .username(request.getUsername())
                .nickname(request.getNickname())
                .password(passwordEncoder.encode(request.getPassword())) // 암호화 필수
                .role("ROLE_USER")
                .build();

        userRepository.save(user);
    }

    //    로그인 로직
    public String login(LoginRequest request) {
        Users user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return jwtProvider.generateToken(user.getUsername());
    }

//    탈퇴 로직
    @Transactional
    public void deleteCurrentUser(String inputCode) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        boolean verified = emailVerificationService.verifyCode(email, inputCode);
        if (!verified) {
            throw new IllegalArgumentException("탈퇴 인증 코드가 유효하지 않습니다.");
        }

        Users user = userRepository.findByUsername(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        userRepository.delete(user); // 사용자 삭제
    }
}