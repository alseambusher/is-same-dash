source config

o1=`mktemp`
o2=`mktemp`
if [ $use_secure -eq 1 ]
then
  wget --user=$username --password=$password $1 -O $o1
  wget --user=$username --password=$password $2 -O $o2
else
  wget $1 -o $o1
  wget $2 -o $o2
fi
echo $o1 $o2
cat $o1 | openssl sha1
cat $o2 | openssl sha1
rm $o1 $o2
