package com.befit.exercise;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeriesService {
    @Autowired
    private SeriesRepository seriesRepository;
    public List<Series> allSeries(){
        return seriesRepository.findAll();
    }
    public Series createSeries(Series s){
        Series series = new Series();
        series.setSeries(s.getSeries());
        series.setRepeatNumber(s.getRepeatNumber());
        series.setWeight(s.getWeight());
        seriesRepository.save(series);
        return series;
    }

    public String dropSeries(Long id){
        if(seriesRepository.findById(id).isEmpty()){
            return "WrongId";
        }
        seriesRepository.deleteById(id);
        return "Deleted";
    }

    public String editSeries(Series s, Long id){
        Optional<Series> tmp = singleSeries(id);
        if (tmp.isEmpty()){
            return "WrongId";
        }else{
            Series series = tmp.get();
            if (series.getSeries() != s.getSeries()){
                series.setSeries(s.getSeries());
            }
            if (series.getRepeatNumber() != s.getRepeatNumber()){
                series.setRepeatNumber(s.getRepeatNumber());
            }
            if (series.getWeight() != s.getWeight()){
                series.setWeight(s.getWeight());
            }
            seriesRepository.save(series);
            return "Updated";
        }
    }

    public Optional<Series> singleSeries(Long id){
        return seriesRepository.findById(id);
    }


}
