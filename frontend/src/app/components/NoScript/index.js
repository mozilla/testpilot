import React from "react";

import LayoutWrapper from "../LayoutWrapper";
import Copter from "../Copter";

type NoScriptProps = {
  showCopter: boolean
}

export default class NoScript extends React.Component {
  props: NoScriptProps

  renderCopter() {
    if (this.props.showCopter) {
      return <Copter />;
    }
    return null;
  }

  render() {
    return <noscript>
      <div className="full-page-wrapper centered">
        <LayoutWrapper flexModifier="column-center">
          <p>Test Pilot requires JavaScript. Sorry about that.</p>
          <p>Test Pilot zahteva JavaScript. Žal nam je.</p>
          <p>Test Pilot vyžaduje JavaScript. Ospravedlňujeme sa za problémy.</p>
          <p>Test Pilot fereasket JavaScript. Sorry derfoar.</p>
          <p>Test Pilot lyp JavaScript. Na ndjeni për këtë.</p>
          <p>Test Pilot memerlukan JavaScript. Harap maaf.</p>
          <p>Test Pilot krev JavaScript. Lei for det.</p>
          <p>Test Pilot requiere JavaScript. Lo sentimos.</p>
          <p>Testpilot kræver JavaScript. Beklager.</p>
          <p>Test Pilot requiere JavaScript. Lo sentimos por ello.</p>
          <p>Test Pilot を使うには JavaScript が必要です。申し訳ありません</p>

          {this.renderCopter()}

          <p>Το Test Pilot απαιτεί JavaScript. Λυπούμαστε γι&#39; αυτό.</p>
          <p>Test Pilot requiere JavaScript. Disculpe</p>
          <p>Siamo spiacenti, Test Pilot richiede JavaScript.</p>
          <p>Omlouváme se, ale Test Pilot vyžaduje JavaScript.</p>
          <p>Test Pilot requiere JavaScript. Lo sentimos.</p>
          <p>Для работы Лётчика-испытателя необходимо включить JavaScript. Извините.</p>
          <p>Je nam žel, ale TestPilot sej JavaScript wužaduje.</p>
          <p>Ri Test Pilot nrajo&#39; JavaScript. Kojakuyu&#39;.</p>
          <p>很抱歉，Test Pilot 需要 JavaScript 来运行。</p>
          <p>Вибачте, але для роботи Test Pilot необхідний JavaScript.</p>
          <p>Test Pilot захтева JavaScript. Жао нам је због овога.</p>
          <p>O Test Pilot requer JavaScript. Pedimos desculpa.</p>
          <p>Test Pilot zahtjeva JavaScript. Žao nam je zbog toga.</p>
          <p>很抱歉，需要開啟 JavaScript 才能使用 Test Pilot</p>
          <p>Desculpe, o Test Pilot requer JavaScript.</p>
          <p>A Tesztpilótához JavaScript szükséges. Sajnáljuk.</p>
          <p>Test Pilot vereist JavaScript. Sorry daarvoor.</p>
          <p>Test Pilot საჭიროებს JavaScript-ს. ვწუხვართ, ამის გამო.</p>
          <p>Test Pilot benötigt JavaScript. Das tut uns leid.</p>
          <p>Test Pilot을 쓰려면 JavaScript가 필요합니다. 죄송합니다.</p>
          <p>Désolé, Test Pilot nécessite JavaScript.</p>
          <p>Test Pilot kräver JavaScript. Ledsen för det.</p>
          <p>Mae Test Pilot angen JavaScript. Ymddiheuriadau.</p>
          <p>Test Pilot requires JavaScript. Sorry about that.</p>
          <p>Jo nam luto, ale TestPilot se JavaScript pomina.</p>
          <p>Test Pilotu için JavaScript şarttır. Kusura bakmayın.</p>
          <p>Test Pilot vereist JavaScript. Sorry daarvoor.</p>
          <p>Test Pilot საჭიროებს JavaScript-ს. ვწუხვართ, ამის გამო.</p>
          <p>Test Pilot benötigt JavaScript. Das tut uns leid.</p>
          <p>Test Pilot을 쓰려면 JavaScript가 필요합니다. 죄송합니다.</p>
          <p>Désolé, Test Pilot nécessite JavaScript.</p>
          <p>Test Pilot kräver JavaScript. Ledsen för det.</p>
          <p>Mae Test Pilot angen JavaScript. Ymddiheuriadau.</p>
          <p>Jo nam luto, ale TestPilot se JavaScript pomina.</p>
          <p>Test Pilotu için JavaScript şarttır. Kusura bakmayın.</p>
        </LayoutWrapper>
      </div>
    </noscript>;
  }
}

NoScript.defaultProps = {
  showCopter: true
};
