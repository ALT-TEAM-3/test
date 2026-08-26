package com.example.project.controller;

import com.example.project.dto.*;
import com.example.project.service.PostService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://127.0.0.1:5500", allowedHeaders = "*")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostResponse create(@AuthenticationPrincipal String email, @Valid @RequestBody PostCreateRequest request) {
        return postService.create(email, request);
    }

    @GetMapping
    public PostPageResponse list(@RequestParam(defaultValue = "0") @Min(0) int page, @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        return postService.getAll(page, size);
    }

    @GetMapping("/{id}")
    public PostResponse get(@PathVariable Long id) {
        return postService.get(id);
    }

    @PutMapping("/{id}")
    public PostResponse update(@PathVariable Long id, @AuthenticationPrincipal String email, @Valid @RequestBody PostUpdateRequest request) {
        return postService.update(id, email, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @AuthenticationPrincipal String email) {
        postService.delete(id, email);
    }
}
