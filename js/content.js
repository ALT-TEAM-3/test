document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        alert('잘못된 접근입니다.');
        location.href = 'main.html';
        return;
    }

    try {
        let myId = null;
        if (token) {
            const userRes = await fetch('http://localhost:8080/api/users/me', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (userRes.ok) {
                const userData = await userRes.json();
                myId = userData.id;
            }
        }

        // API 호출
        const postRes = await fetch(`http://localhost:8080/api/posts/${postId}`);
        if (!postRes.ok) {
            alert('게시글을 불러올 수 없습니다.');
            location.href = 'main.html';
            return;
        }

        const post = await postRes.json();

        document.querySelector('#title_area h2').innerText = post.title;
        document.querySelector('#info_div').innerHTML = `
            <span>작성자: ${post.author || post.writer || '익명'}</span>
            <span>|</span>
            <span>${post.createdAt ? post.createdAt.substring(0, 10) : ''}</span>
        `;
        document.querySelector('#content_area p').innerText = post.content;

        const btnArea = document.getElementById('btn_area');
        const authorId = post.userId || post.authorId || post.writerId;

        if (myId && myId === authorId) {
            const editBtn = btnArea.children[1];
            const deleteBtn = btnArea.children[2];

            editBtn.onclick = function() {
                location.href = `retouch.html?id=${postId}`;
            };

            deleteBtn.addEventListener('click', function() {
                if (confirm('정말 이 게시글을 삭제하시겠습니까?')) {
                    fetch(`http://localhost:8080/api/posts/${postId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': 'Bearer ' + token }
                    })
                    .then(res => {
                        if (res.status === 204 || res.ok) {
                            alert('게시글이 삭제되었습니다.');
                            location.href = 'main.html';
                        } else {
                            alert('게시글 삭제에 실패했습니다.');
                        }
                    })
                    .catch(err => console.log('삭제 에러:', err));
                }
            });
        } else {
            btnArea.children[1].style.display = 'none';
            btnArea.children[2].style.display = 'none';
        }

    } catch (error) {
        console.log('에러 발생:', error);
    }
});