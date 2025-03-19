@Configuration
@Profile("!test")
@RequiredArgsConstructor
public class MongoConfiguration {

    private final EnvConfiguration envConfiguration;

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(envConfiguration.getMongoUri());
    }

    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(new SimpleMongoClientDatabaseFactory(mongoClient(), envConfiguration.getDatabaseName()));
    }

}