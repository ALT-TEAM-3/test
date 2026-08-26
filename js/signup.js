document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (token) {
        location.href = 'main.html';
        return;
    }

    const signupForm = document.getElementById('signup_form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const userEmail = document.getElementById('email').value;
            const userPw = document.getElementById('pw').value;
            const userRePw = document.getElementById('repw').value;

            const hasLetter = /[a-zA-Z]/.test(userPw);
            const hasNumber = /[0-9]/.test(userPw);

            if (!hasLetter || !hasNumber) {
                alert('비밀번호는 영문자와 숫자를 최소 1개씩 포함해야 합니다.');
                document.getElementById('pw').focus();
                return;
            }

            if (userPw !== userRePw) {
                alert('비밀번호가 일치하지 않습니다. 다시 확인해 주세요.');
                document.getElementById('repw').focus();
                return;
            }

            const signupData = {
                name: typeof userName !== 'undefined' ? userName : '',
                email: userEmail,
                password: userPw
            };

            // API 호출
            fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupData)
            })
            .then(function(response) {
                if (response.status === 201 || response.ok) {
                    alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
                    location.href = 'login.html';
                } else {
                    alert('회원가입에 실패했습니다.');
                }
            })
            .catch(function(error) {
                console.log('에러 발생:', error);
                alert('서버와 통신 중 에러가 발생했습니다.');
            });
        });
    }
});