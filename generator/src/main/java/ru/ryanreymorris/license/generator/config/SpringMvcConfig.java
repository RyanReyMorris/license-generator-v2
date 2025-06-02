package ru.ryanreymorris.license.generator.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.util.regex.Pattern;

@Configuration
public class SpringMvcConfig implements WebMvcConfigurer {

    private static final String[] CLASSPATH_RESOURCE_LOCATIONS = {"file:./frontend/dev/browser/", "file:./frontend/prod/browser/", "classpath:/static/taiga/", "classpath:/BOOT-INF/classes/static/taiga/"};
    private static final String[] OLD_CLASSPATH_RESOURCE_LOCATIONS = {"file:./old-frontend/dist/dev/", "file:./old-frontend/dist/prod/", "classpath:/static/old/", "classpath:/BOOT-INF/classes/static/old/"};

    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/taiga/*.*", "/taiga/**/*.*")
                .addResourceLocations(CLASSPATH_RESOURCE_LOCATIONS)
                .setCacheControl(CacheControl.noCache())
                .setCachePeriod(0)
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource;
                        boolean isAdminRoute = Pattern.compile("^index.html.*").matcher(resourcePath).matches();
                        if (isAdminRoute) {
                            requestedResource = location.createRelative("index.html");
                        } else {
                            requestedResource = location.createRelative(resourcePath);
                        }
                        if (requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        return null;
                    }
                });
        registry.addResourceHandler("/old/**")
                .addResourceLocations(OLD_CLASSPATH_RESOURCE_LOCATIONS)
                .resourceChain(false)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource;
                        boolean isAdminRoute = Pattern.compile("^index.html.*").matcher(resourcePath).matches();
                        if (isAdminRoute) {
                            requestedResource = location.createRelative("index.html");
                        } else {
                            requestedResource = location.createRelative(resourcePath);
                        }
                        if (requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        return null;
                    }
                });
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("forward:/old");
        registry.addViewController("/old").setViewName("forward:/old/index.html");
        registry.addViewController("/old/").setViewName("forward:/old/index.html");
        registry.addViewController("/taiga").setViewName("forward:/taiga/index.html");
        registry.addViewController("/taiga/").setViewName("forward:/taiga/index.html");
        //Не учитываются запросы на ресурсы вида .js/.html/.css
        registry.addViewController("/old/{path:(?!.*\\.\\w+)[\\w]+}").setViewName("forward:/old");
        registry.addViewController("/old/{path:(?!.*\\.\\w+)[\\w]+}/{path:(?!.*\\.\\w+)[\\w]+}").setViewName("forward:/old");
        //Не учитываются запросы на ресурсы вида .js/.html/.css
        registry.addViewController("/taiga/{path:(?!.*\\.\\w+)[\\w]+}").setViewName("forward:/taiga");
        registry.addViewController("/taiga/{path:(?!.*\\.\\w+)[\\w]+}/{path:(?!.*\\.\\w+)[\\w]+}").setViewName("forward:/taiga");
        registry.addViewController("/taiga/{path:(?!.*\\.\\w+)[\\w]+}/{path:(?!.*\\.\\w+)[\\w]+}/**").setViewName("forward:/taiga/404");
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
    }
}