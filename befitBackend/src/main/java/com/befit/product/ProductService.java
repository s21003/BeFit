package com.befit.product;

import com.befit.training.Training;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;
    public List<Product> allProducts(){
        return productRepository.findAll();
    }
    public Product createProduct(Product p){
        Product product = new Product();
        product.setName(p.getName());
        product.setKcal(p.getKcal());
        product.setProtein(p.getProtein());
        product.setFat(p.getFat());
        product.setCarbs(p.getCarbs());
        product.setWeight(p.getWeight());
        product.setCreatorUsername(p.getCreatorUsername());
        productRepository.save(product);
        return product;
    }
    public String dropProduct(Long id){
        if(productRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        productRepository.deleteById(id);
        return "Deleted";
    }
    public String editProduct(Product p, Long id){
        Optional<Product> existingProduct = singleProduct(id);
        if (existingProduct.isEmpty()){
            return "WrongId";
        }else{
            Product updatedProduct = existingProduct.get();
            updatedProduct.setName(p.getName());
            updatedProduct.setKcal(p.getKcal());
            updatedProduct.setProtein(p.getProtein());
            updatedProduct.setFat(p.getFat());
            updatedProduct.setCarbs(p.getCarbs());
            updatedProduct.setWeight(p.getWeight());

            productRepository.save(updatedProduct);
            return "Updated";
        }
    }
    public Optional<Product> singleProduct(Long id){
        return productRepository.findById(id);
    }

    public List<Product> ownProducts(String username){

        return productRepository.findByCreatorUsername(username);
    }

    public List<Product> getProducts(String username) {
        return productRepository.findByCreatorUsernameOrCreatorUsernameIsNull(username);
    }
}
