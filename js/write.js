document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('로그인이 필요합니다.');
        location.href = 'login.html';
    }
});

document.getElementById('write_form').addEventListener('submit', function(e) {
    e.preventDefault(); 

    const title = document.getElementById('input_title').value;
    const content = document.getElementById('input_content').value;

    const token = localStorage.getItem('token');

    const postData = {
        title: title,
        content: content
    };
    //API 호출
    fetch('http://localhost:8080/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
        },
        body: JSON.stringify(postData)
    })
    .then(function(response) {
        if (response.status === 201 || response.ok) {
            alert('게시글이 성공적으로 등록되었습니다!');
            location.href = 'main.html'; 
        } else if (response.status === 401) {
            alert('인증이 만료되었습니다. 다시 로그인해 주세요.');
            location.href = 'login.html';
        } else {
            alert('게시글 등록에 실패했습니다.');
        }
    })
    .catch(function(error) {
        console.log('에러 발생:', error);
        alert('서버와 통신 중 에러가 발생했습니다.');
    });
});