package com.befit.product;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Long> {
    List<Product> findByCreatorUsername(String username);

    List<Product> findByCreatorUsernameOrCreatorUsernameIsNull(String username);
}
