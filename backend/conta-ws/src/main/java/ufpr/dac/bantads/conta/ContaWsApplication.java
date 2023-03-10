package ufpr.dac.bantads.conta;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(entityManagerFactoryRef = "entityManagerFactory", basePackages = {
"ufpr.dac.bantads.conta.repository" })
public class ContaWsApplication {

	public static void main(String[] args) {
		SpringApplication.run(ContaWsApplication.class, args);
	}
	
	@Bean
    ModelMapper modelMapper() {
        return new ModelMapper();
    }

}
