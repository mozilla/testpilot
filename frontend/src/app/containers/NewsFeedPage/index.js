// @flow

import React from "react";
import cookies from "js-cookie";
import { Localized } from "fluent-react/compat";

import View from "../../components/View";
import LayoutWrapper from "../../components/LayoutWrapper";
import UpdateList from "../../components/UpdateList";

import "./index.scss";

type NewsFeedPageProps = {
  sendToGA: Function,
  staleNewsUpdates: Array<Object>,
  freshNewsUpdates: Array<Object>,
  experiments: Array<Object>
}

export default class NewsFeedPage extends React.Component {
  props: NewsFeedPageProps

  componentDidMount() {
    cookies.set("updates-last-viewed-date", new Date().toISOString());
  }

  render() {
    return (
      <View spaceBetween={false} showNewsletterFooter={false} {...this.props}>
        <LayoutWrapper flexModifier="column-center">
          <div id="news-feed-page">
            <Localized id="newsFeedPageHeading">
              <h1>News Feed</h1>
            </Localized>
            <UpdateList {...this.props} initialShowMoreNews={true} hideHeader={true} />
          </div>
        </LayoutWrapper>
      </View>
    );
  }
}
