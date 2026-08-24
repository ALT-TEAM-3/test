document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('로그인이 필요한 서비스입니다.');
        location.href = 'login.html';
        return;
    }

    const logoutBtn = document.querySelector('#my_info button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('token'); 
            alert('로그아웃되었습니다.');
            location.href = 'login.html'; 
        });
    }

    fetchPosts();
});
 //api 호출 
function fetchPosts() {
    fetch('http://localhost:8080/api/posts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('게시글 목록을 불러오지 못했습니다.');
        }
    })
    .then(function(data) {
        const postList = document.getElementById('post_list');
        postList.innerHTML = '';

        const posts = data.content || data;

        if (posts.length === 0) {
            postList.innerHTML = '<div class="post_item"><span style="padding: 20px;">등록된 게시글이 없습니다.</span></div>';
            return;
        }

        posts.forEach(function(post) {
            const postItem = document.createElement('div');
            postItem.className = 'post_item';

            postItem.innerHTML = `
                <span class="col_id">${post.id}</span>
                <a href="../html/detail.html?id=${post.id}" class="col_title">${post.title}</a>
                <span class="col_author">${post.author || post.writer || '작성자'}</span>
                <span class="col_date">${post.createdAt ? post.createdAt.substring(0, 10) : ''}</span>
            `;

            postList.appendChild(postItem);
        });
    })
    .catch(function(error) {
        console.log('에러 발생:', error);
    });
}