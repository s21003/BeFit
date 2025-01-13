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
        Optional<Product> tmp = singleProduct(id);
        if (tmp.isEmpty()){
            return "WrongId";
        }else{
            Product product = tmp.get();
            if (product.getName() != p.getName()){
                product.setName(p.getName());
            }
            if(product.getKcal() != p.getKcal()){
                product.setKcal(p.getKcal());
            }
            if (product.getProtein() != p.getProtein()){
                product.setProtein(p.getProtein());
            }
            if (product.getFat() != p.getFat()){
                product.setFat(p.getFat());
            }
            if (product.getCarbs() != p.getCarbs()){
                product.setCarbs(p.getCarbs());
            }
            if (product.getWeight() != p.getWeight()){
                product.setWeight(p.getWeight());
            }
            productRepository.save(product);
            return "Updated";
        }
    }
    public Optional<Product> singleProduct(Long id){
        return productRepository.findById(id);
    }

    public List<Product> ownProducts(String username){
        return productRepository.findByCreatorUsername(username);
    }

}
