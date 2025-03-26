package com.microservices.event_service.dao;

import com.microservices.event_service.models.Event;
import com.microservices.event_service.models.EventType;
import com.microservices.event_service.models.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class EventDao {

    private final MongoTemplate mongoTemplate;

    private static final String EVENT_COLLECTION = "EVENTS";

    public void save(Event event) {
        mongoTemplate.save(event, EVENT_COLLECTION);
    }

    public Optional<Event> findById(String eventId) {
        return Optional.ofNullable(mongoTemplate.findById(eventId, Event.class, EVENT_COLLECTION));
    }

    public void delete(String eventId) {
        mongoTemplate.remove(new Query(Criteria.where("_id").is(eventId)), EVENT_COLLECTION);
    }

    public long countEventsWithRequest(String filter, String filterSearch) {
        Query query = applyFilters(filter, filterSearch);
        return mongoTemplate.count(query, Event.class, EVENT_COLLECTION);
    }

    public List<Event> searchEventsByRequest(String filter, String filterSearch, int page, int pageSize) {
        Query query = applyFilters(filter, filterSearch);

        query.with(PageRequest.of(page, pageSize));

        query.with(Sort.by(Sort.Direction.DESC, "startTime"));

        return mongoTemplate.find(query, Event.class, EVENT_COLLECTION);
    }

    private Query applyFilters(String filter, String filterSearch) {
        Query query = new Query();

        if (filter != null && !filter.isEmpty()) {
            try {
                switch (Filter.valueOf(filter.toUpperCase())) {
                    case ARTIST:
                        Criteria artistsCriteria = Criteria.where("artists").exists(true).not().size(0);
                        if (filterSearch != null && !filterSearch.isEmpty()) {
                            artistsCriteria = artistsCriteria.andOperator(
                                    Criteria.where("artists").regex("^" + filterSearch, "i")
                            );
                        }
                        query.addCriteria(artistsCriteria);
                        break;
                    case FESTIVAL:
                        query.addCriteria(Criteria.where("eventType").is(EventType.FESTIVAL));
                        if (filterSearch != null && !filterSearch.isEmpty()) {
                            query.addCriteria(Criteria.where("name").regex("^" + filterSearch, "i"));
                        }
                        break;
                    case CONCERT:
                        query.addCriteria(Criteria.where("eventType").is(EventType.CONCERT));
                        if (filterSearch != null && !filterSearch.isEmpty()) {
                            query.addCriteria(Criteria.where("name").regex("^" + filterSearch, "i"));
                        }
                        break;
                    case PLACE:
                        query.addCriteria(Criteria.where("address").exists(true).ne(""));
                        if (filterSearch != null && !filterSearch.isEmpty()) {
                            query.addCriteria(Criteria.where("address").regex("^" + filterSearch, "i"));
                        }
                        break;
                    case EVENT:
                        if (filterSearch != null && !filterSearch.isEmpty()) {
                            query.addCriteria(Criteria.where("name").regex("^" + filterSearch, "i"));
                        }
                        break;
                    default:
                        break;
                }
            } catch (IllegalArgumentException ignored) {}
        } else if (filterSearch != null && !filterSearch.isEmpty()) {
            query.addCriteria(Criteria.where("name").regex("^" + filterSearch, "i"));
        }

        return query;
    }

}
