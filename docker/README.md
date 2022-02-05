## ctAutocomplete running in Docker

### Updating the ctAutocomplete app
1. Commit changes and merge bugfix / feature PR
2. From master branch with latest code run:
```
> docker build -t registry.ctcue.com/ctautocomplete:[newtag] -f docker/ctAutocomplete/Dockerfile .
> docker push registry.ctcue.com/ctautocomplete:[newtag]
```
3. Follow instructions below on updating docker versions in production

## Production
### Updating app config
1. Add or adjust `config/local_config.json` to reflect configuration
2. `> docker-compose restart ct-autocomplete`

### Updating docker-compose.yml
1. Adjust docker-compose.yml to reflect configuration
2. ```
   > docker-compose down && docker-compose up -d
   ```

#### Changing docker image versions
1. Adjust docker-compose.yml to reflect versions of Elasticsearch or ctAutocomplete
2. ```
   > docker-compose pull
   > docker-compose down && docker-compose up -d
   ```

