package ufpr.dac.bantads.conta;

import java.util.HashMap;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(entityManagerFactoryRef = "contaReadEntityManagerFactory", transactionManagerRef = "contaReadTransactionManager", basePackages = {
		"ufpr.dac.bantads.conta.contaread.repository" })
public class ContaReadConfig {

	@Bean(name = "contareadDataSource")
	@ConfigurationProperties(prefix = "spring.contaread.datasource")
	public DataSource dataSource() {
		return DataSourceBuilder.create().build();
	}

	@Bean(name = "contaReadEntityManagerFactory")
	public LocalContainerEntityManagerFactoryBean contaReadEntityManagerFactory(EntityManagerFactoryBuilder builder,
			@Qualifier("contareadDataSource") DataSource dataSource) {
		HashMap<String, Object> properties = new HashMap<>();
		properties.put("hibernate.hbm2ddl.auto", "update");
		properties.put("hibernate.dialect", "org.hibernate.dialect.PostgreSQLDialect");
		return builder.dataSource(dataSource).properties(properties)
				.packages("ufpr.dac.bantads.conta.model").persistenceUnit("Conta").build();
	}

	@Bean(name = "contaReadTransactionManager")
	public PlatformTransactionManager contaReadTransactionManager(
			@Qualifier("contaReadEntityManagerFactory") EntityManagerFactory contaReadEntityManagerFactory) {
		return new JpaTransactionManager(contaReadEntityManagerFactory);
	}
}
