set -e
declare -a mustContainFiles=$(
  node -e "
    const {files, main, module, types} = require('./package.json');
    process.stdout.write(
      [].concat(files, main, module, types).filter(Boolean).join(' ')
    );
  "
)
for file in $mustContainFiles
do
  if [ ! -e $file ]
  then
    echo "Cannot publish - '$file' not found."
    exit 1
  fi
  if [ -d $file ]
  then
    declare testFile=$(
      find $file -type d -name "__*__" -or -type f -name "*.test.*" | head -n 1
    )
    if [ ! -z $testFile ]
    then
      echo "Cannot publish - '$file' contains a test file '$testFile'."
      exit 1
    fi
  fi
done
