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
        let myEmail = null;
        if (token) {
            const userRes = await fetch('http://localhost:8080/api/users/me', {
                headers: { 'Authorization': 'Bearer ' + token }
            });
            if (userRes.ok) {
                const userData = await userRes.json();
                myEmail = userData.email || userData.userEmail;
            }
        }

        const postRes = await fetch(`http://localhost:8080/api/posts/${postId}`);
        if (!postRes.ok) {
            alert('게시글을 불러올 수 없습니다.');
            location.href = 'main.html';
            return;
        }

        const post = await postRes.json();

        const rawAuthor = post.email || post.authorEmail || post.writerEmail || post.author || post.writer || '';

        const authorName = rawAuthor.includes('@') ? rawAuthor.split('@')[0] : (rawAuthor || '익명');

        document.querySelector('#title_area h2').innerText = post.title;
        
        document.querySelector('#info_div').innerHTML = `
            <span>작성자: ${authorName}</span>
            <span>|</span>
            <span>${post.createdAt ? post.createdAt.substring(0, 10) : ''}</span>
        `;
        document.querySelector('#content_area p').innerText = post.content;

        const buttonArea = document.getElementById('button_area');

        const isOwner = myEmail && rawAuthor && myEmail.trim().toLowerCase() === rawAuthor.trim().toLowerCase();

        const editButton = buttonArea.children[1];
        const deleteButton = buttonArea.children[2];

        editButton.style.display = '';
        deleteButton.style.display = '';

        editButton.onclick = function() {
            if (!isOwner) {
                alert('수정 권한이 없습니다.');
                return;
            }
            location.href = `retouch.html?id=${postId}`;
        };
        deleteButton.onclick = function() {
            if (!isOwner) {
                alert('삭제 권한이 없습니다.');
                return;
            }

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
        };

    } catch (error) {
        console.log('에러 발생:', error);
    }
});