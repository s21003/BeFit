package com.befit.series;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeriesService {
    @Autowired
    private SeriesRepository seriesRepository;
    public List<Series> allSeries() { return seriesRepository.findAll();}

    public Series createSeries(Series s){
        Series series = new Series();
        series.setSeries(s.getSeries());
        series.setRepeatNumber(s.getRepeatNumber());
        series.setWeight(s.getWeight());
        seriesRepository.save(series);
        return series;
    }

    public String dropSeries(Long id){
        if (seriesRepository.findById(id).isEmpty()){
            return "Wrong Id";
        }
        seriesRepository.deleteById(id);
        return "Deleted";
    }

    public String editSeries(Series s, Long id){
        Optional<Series> existingSeries = singleSeries(id);
        if (existingSeries.isEmpty()){
            return "Wrong Id";
        }else{
            Series updatedSeries = existingSeries.get();
            updatedSeries.setSeries(s.getSeries());
            updatedSeries.setRepeatNumber(s.getSeries());
            updatedSeries.setWeight(s.getWeight());

            seriesRepository.save(updatedSeries);
            return "Updated";
        }
    }

    public Optional<Series> singleSeries(Long id){ return seriesRepository.findById(id); }
}
