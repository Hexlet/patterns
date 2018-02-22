FROM ruby

WORKDIR /usr/src/app

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock

RUN bundle

COPY . .

ENV EXECJS_RUNTIME Node

CMD bundle exec middleman server
