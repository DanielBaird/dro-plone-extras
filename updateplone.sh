
echo
echo " * About to update Plone."

pushd ~/jcu/dro-plone-extras


echo
echo " * compiling css... "
scss scss/dro.css.scss dist/dro.css
autoprefixer --browsers "> 1%, last 2 versions, Firefox ESR, Opera 12.1" dist/dro.css

echo
echo " * compiling js... "
cat js/dro-calendar.js js/dro.js > dist/dro.js

echo
popd
echo " * done."



# # couldn't convince plone to accept uploading via curl or wget.
# # sorry, you'll have to upload the results yourself.
#
# echo
# echo
# echo " * uploading js... "
# curl --silent --request POST 'https://research.jcu.edu.au/dro/dro_custom.js' \
# --user dro-uploader:`cat ./dro-uploader-pass` \
# --form "title=theme_js" \
# --form "content_type:required=application/javascript" \
# --form "precondition=" \
# --form "manage_upload:method=Upload" \
# --form "fileupload=@dist/dro.js;filename=dro.js;type=application/x-javascript" | grep 'aved change'



