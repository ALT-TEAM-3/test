package com.example.project.service;
import com.example.project.dto.*;
import com.example.project.entity.Post;
import com.example.project.entity.User;
import com.example.project.exception.CustomException;
import com.example.project.exception.ErrorCode;
import com.example.project.repository.PostRepository;
import com.example.project.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PostService {
    private final PostRepository postRepository; private final UserRepository userRepository;
    public PostService(PostRepository postRepository, UserRepository userRepository) { this.postRepository = postRepository; this.userRepository = userRepository; }
    @Transactional public PostResponse create(String email, PostCreateRequest request) { return PostResponse.from(postRepository.save(new Post(currentUser(email), request.title(), request.content()))); }
    public PostResponse get(Long id) { return PostResponse.from(findPost(id)); }
    public PostPageResponse getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return PostPageResponse.from(postRepository.findAll(pageable).map(PostSummaryResponse::from));
    }
    @Transactional public PostResponse update(Long id, String email, PostUpdateRequest request) {
        Post post = findPost(id); verifyOwner(post, email); post.update(request.title(), request.content()); return PostResponse.from(post);
    }
    @Transactional public void delete(Long id, String email) { Post post = findPost(id); verifyOwner(post, email); postRepository.delete(post); }
    private Post findPost(Long id) { return postRepository.findById(id).orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND)); }
    private User currentUser(String email) { return userRepository.findByEmail(email).orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND)); }
    private void verifyOwner(Post post, String email) { if (!post.getUser().getEmail().equals(email)) throw new CustomException(ErrorCode.FORBIDDEN); }
}
