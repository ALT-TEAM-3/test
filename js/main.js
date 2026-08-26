document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('로그인이 필요한 서비스입니다.');
        location.href = 'login.html';
        return;
    }

    const logoutButton = document.querySelector('#my_info button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('token'); 
            alert('로그아웃되었습니다.');
            location.href = 'login.html'; 
        });
    }

    fetchPosts(0);
});

function fetchPosts(page = 0) {
    fetch(`http://localhost:8080/api/posts?page=${page}&size=10`, {
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

        const posts = data.content || (Array.isArray(data) ? data : []);

        if (posts.length === 0) {
            postList.innerHTML = '<div class="post_item"><span style="padding: 20px;">등록된 게시글이 없습니다.</span></div>';
            return;
        }

        posts.forEach(function(post) {
            const postItem = document.createElement('div');
            postItem.className = 'post_item';

            postItem.innerHTML = `
                <span class="col_id">${post.id}</span>
                <a href="../html/content.html?id=${post.id}" class="col_title">${post.title}</a>
                <span class="col_author">${(post.email || post.authorEmail || post.author || '').split('@')[0] || '불러오지 못함'}</span>
                <span class="col_date">${post.createdAt ? post.createdAt.substring(0, 10) : ''}</span>
            `;

            postList.appendChild(postItem);
        });

        if (data.totalPages !== undefined) {
            renderPagination(data.totalPages, data.number || page);
        }
    })
    .catch(function(error) {
        console.log('에러 발생:', error);
    });
}

function renderPagination(totalPages, currentPage) {
    const pageContainer = document.getElementById('page');
    if (!pageContainer) return;

    pageContainer.innerHTML = '';

    for (let i = 0; i < totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.type = 'button';
        pageButton.innerText = i + 1;

        if (i === currentPage) {
            pageButton.style.fontWeight = 'bold';
            pageButton.style.textDecoration = 'underline';
        }

        pageButton.onclick = function() {
            fetchPosts(i);
        };

        pageContainer.appendChild(pageButton);
    }
}