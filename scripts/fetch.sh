#!/bin/bash

source config

index=0
for url in $@
do
  o1=$(mktemp)
  if [ $use_secure -eq 1 ]
  then
    wget --user=$username --password=$password $url -O $o1
  else
    wget $url -O $o1
  fi
  cat $o1 | openssl sha1
  data[$index]="$o1"
  index=$(($index+1))
done

#this is used as a splitter
rand=$(($RANDOM*$RANDOM*$RANDOM))
echo $rand
for ((i = 0; i < ${#data[@]}; i++))
do
    for ((j = 0; j < ${#data[@]}; j++))
    do
      diff "${data[$i]}" "${data[$j]}" | head
      echo $rand
    done
done

# remove all the files downloaded
for ((i = 0; i < ${#data[@]}; i++))
do
  rm ${data[$i]}
done
