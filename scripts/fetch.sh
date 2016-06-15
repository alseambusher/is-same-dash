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
  data[index]=$(cat $o1)
  index=$(($index+1))
  rm $o1
done

for ((i = 0; i < ${#data[@]}; i++))
do
    for ((j = 0; j < ${#data[@]}; j++))
    do
      #DIFF=$(diff <(echo "${data[$i]}") <(echo "${data[$j]}"))
      echo `diff <(echo "${data[$i]}") <(echo "${data[$j]}")`
    done
done
