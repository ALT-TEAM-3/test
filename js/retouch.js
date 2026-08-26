document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('로그인이 필요합니다.');
        location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        alert('잘못된 접근입니다.');
        location.href = 'main.html';
        return;
    }

    // API 호출
    fetch(`http://localhost:8080/api/posts/${postId}`)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                alert('게시글 정보를 불러올 수 없습니다.');
                location.href = 'main.html';
                throw new Error('조회 실패');
            }
        })
        .then(function(post) {
            document.getElementById('input_title').value = post.title;
            document.getElementById('input_content').value = post.content;
        })
        .catch(function(error) {
            console.log('에러 발생:', error);
        });

    const resetButton = document.querySelector('button[type="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            e.preventDefault(); 
            location.href = `content.html?id=${postId}`;
        });
    }
});

document.getElementById('write_form').addEventListener('submit', function(e) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const title = document.getElementById('input_title').value;
    const content = document.getElementById('input_content').value;

    const updateData = {
        title: title,
        content: content
    };

    fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(updateData)
    })
    .then(function(response) {
        if (response.status === 200 || response.ok) {
            alert('게시글이 성공적으로 수정되었습니다.');
            location.href = `content.html?id=${postId}`;
        } else if (response.status === 403) {
            alert('수정 권한이 없습니다.');
        } else {
            alert('게시글 수정에 실패했습니다.');
        }
    })
    .catch(function(error) {
        console.log('에러 발생:', error);
        alert('서버와 통신 중 에러가 발생했습니다.');
    });
});