package com.befit.weights;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WeightsService {
    @Autowired
    private WeightsRepository weightsRepository;
    public List<Weights> allWeights() { return weightsRepository.findAll();}

    public Weights createWeights(Weights w){
        Weights weights = new Weights();
        weights.setWeight(w.getWeight());
        weightsRepository.save(weights);
        return weights;
    }

    public String dropWeights(Long id){
        if (weightsRepository.findById(id).isEmpty()){
            return "Wrong Id";
        }
        weightsRepository.deleteById(id);
        return "Deleted";
    }

    public String editWeights(Weights w, Long id){
        Optional<Weights> existingWeights = singleWeights(id);
        if (existingWeights.isEmpty()){
            return "Wrong Id";
        }else{
            Weights updatedWeights = existingWeights.get();
            updatedWeights.setWeight(w.getWeight());

            weightsRepository.save(updatedWeights);
            return "Updated";
        }
    }

    public Optional<Weights> singleWeights(Long id){ return weightsRepository.findById(id); }

}
