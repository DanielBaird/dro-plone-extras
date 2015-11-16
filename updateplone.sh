
echo
echo " * About to update Plone."
echo
echo "   For this to work, you need node-sass and autoprefixer.  On OSX:"
echo "   brew install node"
echo "   npm install -g node-sass autoprefixer-cli"
echo "   To use original Ruby-gem sass, edit this script."

pushd ~/jcu/dro-plone-extras


echo
echo " * compiling css... "
node-sass scss/dro.css.scss dist/dro.css
autoprefixer-cli --browsers "> 1%, last 2 versions, Firefox ESR, Opera 12.1" dist/dro.css

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
