document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('로그인이 필요합니다.');
        location.href = 'login.html';
        return;
    }

    // api 호출
    fetch('http://localhost:8080/api/users/me', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
            alert('사용자 정보를 불러오지 못했습니다.');
            localStorage.removeItem('token');
            location.href = 'login.html';
            throw new Error('내 정보 조회 실패');
        }
    })
    .then(function(user) {
        document.getElementById('user_id').value = user.email || user.userId || user.id;
        document.getElementById('user_name').value = user.name || user.username;
    })
    .catch(function(error) {
        console.log('에러 발생:', error);
    });


    document.getElementById('delete_button').addEventListener('click', function() {
        if (confirm('정말 회원 탈퇴하시겠습니까? 탈퇴 후에는 계정을 복구할 수 없습니다.')) {
            fetch('http://localhost:8080/api/users/me', {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(function(response) {
                if (response.status === 204 || response.ok) {
                    alert('회원 탈퇴가 완료되었습니다.');
                    localStorage.removeItem('token');
                    location.href = 'login.html';
                } else {
                    alert('회원 탈퇴 처리 중 오류가 발생했습니다.');
                }
            })
            .catch(function(error) {
                console.log('탈퇴 에러:', error);
            });
        }
    });
});


document.getElementById('pw_change_form').addEventListener('submit', function(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const newPw = document.getElementById('new_pw').value;

    const hasLetter = /[a-zA-Z]/.test(newPw);
    const hasNumber = /[0-9]/.test(newPw);

    if (!hasLetter || !hasNumber) {
        alert('비밀번호는 영문자와 숫자를 최소 1개씩 포함해야 합니다.');
        document.getElementById('new_pw').focus();
        return;
    }

    const updateData = {
        password: newPw
    };

    fetch('http://localhost:8080/api/users/me', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(updateData)
    })
    .then(function(response) {
        if (response.status === 200 || response.ok) {
            alert('비밀번호가 성공적으로 변경되었습니다!');
            document.getElementById('new_pw').value = ''; 
        } else {
            alert('비밀번호 변경에 실패했습니다.');
        }
    })
    .catch(function(error) {
        console.log('에러 발생:', error);
        alert('서버와 통신 중 에러가 발생했습니다.');
    });
});