import ava from 'ava';
import sinon from 'sinon';
import AircraftModel from '../../src/assets/scripts/client/aircraft/AircraftModel';
import UiController from '../../src/assets/scripts/client/ui/UiController';
import GameController, { GAME_EVENTS } from '../../src/assets/scripts/client/game/GameController';
import ScoreController from '../../src/assets/scripts/client/game/ScoreController';
import { ARRIVAL_AIRCRAFT_INIT_PROPS_MOCK } from '../aircraft/_mocks/aircraftMocks';

let sandbox; // using the sinon sandbox ensures stubs are restored after each test

/* eslint-disable no-unused-vars, no-undef */
ava.beforeEach(() => {
    sandbox = sinon.sandbox.create();
});

ava.afterEach(() => {
    sandbox.restore();
});
/* eslint-enable no-unused-vars, no-undef */

ava('._penalizeLocalizerInterceptAltitude() records an event and notifies the user of their error when above the glideslope', (t) => {
    const scoreController = new ScoreController();
    const aircraftModel = new AircraftModel(ARRIVAL_AIRCRAFT_INIT_PROPS_MOCK);
    const uiControllerUiLogStub = sandbox.stub(UiController, 'ui_log');
    const gameControllerRecordEventStub = sandbox.stub(GameController, 'events_recordNew');
    const expectedLogMessage = `${aircraftModel.getCallsign()} intercepted localizer above glideslope`;

    sandbox.stub(aircraftModel, 'isAboveGlidepath', () => true);
    scoreController._penalizeLocalizerInterceptAltitude(aircraftModel);

    t.true(uiControllerUiLogStub.calledWithExactly(expectedLogMessage, true));
    t.true(gameControllerRecordEventStub.calledWithExactly(GAME_EVENTS.LOCALIZER_INTERCEPT_ABOVE_GLIDESLOPE));
});

ava('._penalizeLocalizerInterceptAltitude() does not record an event when at or below glideslope', (t) => {
    const scoreController = new ScoreController();
    const aircraftModel = new AircraftModel(ARRIVAL_AIRCRAFT_INIT_PROPS_MOCK);
    const uiControllerUiLogStub = sandbox.stub(UiController, 'ui_log');
    const gameControllerRecordEventStub = sandbox.stub(GameController, 'events_recordNew');

    sandbox.stub(aircraftModel, 'isAboveGlidepath', () => false);
    scoreController._penalizeLocalizerInterceptAltitude(aircraftModel);

    t.true(uiControllerUiLogStub.notCalled);
    t.true(gameControllerRecordEventStub.notCalled);
});

ava('._penalizeLocalizerInterceptAngle() records an event and notifies the user of their error', (t) => {
    const scoreController = new ScoreController();
    const aircraftModel = new AircraftModel(ARRIVAL_AIRCRAFT_INIT_PROPS_MOCK);
    const uiControllerUiLogStub = sandbox.stub(UiController, 'ui_log');
    const gameControllerRecordEventStub = sandbox.stub(GameController, 'events_recordNew');
    const expectedLogMessage = `${aircraftModel.getCallsign()} approach course intercept angle was greater than 30 degrees`;
    const result = scoreController._penalizeLocalizerInterceptAngle(aircraftModel);

    t.true(typeof result === 'undefined');
    t.true(uiControllerUiLogStub.calledWithExactly(expectedLogMessage, true));
    t.true(gameControllerRecordEventStub.calledWithExactly(GAME_EVENTS.ILLEGAL_APPROACH_CLEARANCE));
});
