package com.ll.blog.domain.email.service;

import com.ll.blog.domain.email.entity.EmailVerification;
import com.ll.blog.domain.email.repository.EmailVerificationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final EmailVerificationRepository emailVerificationRepository;
    private final EmailService emailService;

//    인증코드 생성 (6자리 랜덤 숫자)
    public String generateCode() {
        Random random = new Random();
        int numberCode = random.nextInt(900000) + 100000; // 6자리 랜덤 숫자 생성
        return String.valueOf(numberCode);
    }

//    인증 메일 요청 처리
    @Transactional
    public void sendVerificationEmail(String email) {
        String code = generateCode();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5); // 5분 후 만료

//        이전 인증 기록 삭제
        emailVerificationRepository.findByEmail(email)
                .ifPresent(emailVerificationRepository::delete);

        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .code(code)
                .expiryTime(expiryTime)
                .build();

        emailVerificationRepository.save(verification);

//        이메일 전송
        emailService.sendEmail(
                email,
                "이메일 인증 코드",
                "인증 코드: " + code + "\n5분 이내에 입력해주세요."
        );
    }

//    인증번호 검증
    @Transactional
    public boolean verifyCode(String email, String inputCode) {
        return emailVerificationRepository.findByEmail(email)
                .filter(v -> !v.isExpired()) // 유효기간 체크
                .filter(v -> v.getCode().equals(inputCode)) // 코드 일치 체크
                .map(v -> {
                    emailVerificationRepository.delete(v); // 인증 성공 시 삭제
                    return true;
                })
                .orElse(false); // 실패 조건
    }
}
