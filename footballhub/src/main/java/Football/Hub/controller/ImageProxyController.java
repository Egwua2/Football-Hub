package Football.Hub.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.net.URI;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/images")
public class ImageProxyController {

    private final RestClient restClient = RestClient.create();

    @GetMapping("/proxy")
    public ResponseEntity<byte[]> proxy(@RequestParam String url) {
        try {
            URI uri = URI.create(url);
            String host = uri.getHost();

            if (host == null || !(host.equals("thesportsdb.com") || host.endsWith(".thesportsdb.com"))) {
                return ResponseEntity.badRequest().build();
            }

            ResponseEntity<byte[]> response = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .toEntity(byte[].class);

            byte[] body = response.getBody();
            if (body == null || body.length == 0) {
                return ResponseEntity.notFound().build();
            }

            MediaType contentType = response.getHeaders().getContentType();
            if (contentType == null || !contentType.getType().equalsIgnoreCase("image")) {
                contentType = MediaType.IMAGE_JPEG;
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(contentType);
            headers.setCacheControl("public, max-age=86400");

            return new ResponseEntity<>(body, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
