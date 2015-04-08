
echo
echo -n " * About to update Plone."
echo

pushd ~/jcu/dro-plone-extras


echo
echo -n " * compiling css... "
scss scss/dro.css.scss dist/dro.css

# echo
# echo
# echo -n " * uploading css... "
# curl --silent --insecure --request PUT 'https://research.jcu.edu.au/dro/dro_custom.css' \
# --user dro-uploader:`cat ./dro-uploader-pass` \
# --form "title=theme_css" \
# --form "content_type:required=text/css" \
# --form "precondition=" \
# --form "manage_upload:method=Upload" \
# --form "fileupload=@dist/dro.css;filename=dro.css;type=text/css" | grep 'aved change'

echo
echo -n " * compiling js... "
cp js/dro.js dist/dro.js

# echo
# echo
# echo -n " * uploading js... "
# curl --silent --request POST 'https://research.jcu.edu.au/dro/dro_custom.js' \
# --user dro-uploader:`cat ./dro-uploader-pass` \
# --form "title=theme_js" \
# --form "content_type:required=application/javascript" \
# --form "precondition=" \
# --form "manage_upload:method=Upload" \
# --form "fileupload=@dist/dro.js;filename=dro.js;type=application/x-javascript" | grep 'aved change'


echo
popd
echo -n " * done."
echo






