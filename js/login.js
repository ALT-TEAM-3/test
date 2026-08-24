document.getElementById('login_form').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const userEmail = document.getElementById('email').value;
    const userPw = document.getElementById('pw').value;

    const loginData = {
        email: userEmail,
        password: userPw
    };

    //API 호출
    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(function(response) {
        if (response.status === 200 || response.ok) {
            return response.json(); 
        } else {
            alert('이메일 또는 비밀번호가 일치하지 않습니다.');
            throw new Error('로그인 실패');
        }
    })
    .then(function(data) {
        const token = data.accessToken || data.token;
        localStorage.setItem('token', token);

        alert('로그인되었습니다!');
        location.href = 'main.html';
    })
    .catch(function(error) {
        console.log('에러 발생:', error);
    });
});