# deploy
ssh deploy@146.185.148.22 'git config --global user.email "fpvonly@gmail.com"; git config --global user.name "fpvonly@gmail.com"; cd e.spacex/; git checkout master; git pull; npm install; npm run prodbuild; git add ./build; git commit -m "Codeship CI build (production) --skip-ci"; git push; sudo npm run foreverrestart;'
