package com.wildtrails.backend.service;

import com.wildtrails.backend.dto.ReviewDTO;
import com.wildtrails.backend.entity.Review;
import com.wildtrails.backend.entity.Customer;
import com.wildtrails.backend.entity.Driver;
import com.wildtrails.backend.entity.Booking;
import com.wildtrails.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<ReviewDTO> getAllReviews() {
        SimpleDateFormat formatter = new SimpleDateFormat("MMMM dd, yyyy");

        return reviewRepository.findAll().stream().map(review -> {
            Booking booking = review.getBooking();

            String formattedDate = "";
            String customerName = "";
            String driverName = "";


            if (booking != null) {
                if (booking.getDate() != null) {
                    formattedDate = formatter.format(booking.getDate());
                }

                Customer customer = booking.getCustomer();
                if (customer != null && customer.getUser() != null) {
                    customerName = customer.getUser().getName();
                }

                Driver driver = booking.getDriver();
                if (driver != null && driver.getUser() != null) {
                    driverName = driver.getUser().getName();
                }
            }

            return new ReviewDTO(
                    review.getId(),
                    customerName,
                    review.getRating(),
                    formattedDate,
                    review.getComment(),
                    driverName
            );
        }).collect(Collectors.toList());
    }

    public void deleteReview(Long id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Review with ID " + id + " does not exist.");
        }
    }

    public void editReview(Long id, ReviewDTO reviewDTO) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id " + id));
        if (reviewDTO.getComment() != null) {
            review.setComment(reviewDTO.getComment());
        }
        reviewRepository.save(review);
    }

}
