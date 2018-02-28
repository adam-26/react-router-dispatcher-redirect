import redirectAction, { REDIRECT } from "../redirectAction";

describe('redirectAction', () => {
    const redirectOpts = {
        to: '/home'
    };
    let action;

    beforeEach(() => {
        action = redirectAction(redirectOpts);
    });

    test('name', () => {
       expect(action.name).toBe(REDIRECT);
    });

    describe('initServerAction', () => {
        test('assigns httpResponse redirect', () => {
            const params = {};
            const props = action.initServerAction(params);

            expect(props.httpResponse.redirect).toBe(false);
        });

        test('retains existing httpResponse redirect', () => {
            const redir = { redirect: '/world' };
            const params = { httpResponse: redir };
            const props = action.initServerAction(params);

            expect(props.httpResponse).toEqual(redir);
        });
    });

    describe('filterParamsToProps', () => {
        test('returns filtered props', () => {
            const httpResp = { httpResponse: { redirect: '/world' } };
            const params = { random: 1, ...httpResp };

            const props = action.filterParamsToProps(params);
            expect(props.httpResponse).toBeDefined();
            expect(props.random).not.toBeDefined();
        });
    });

    describe('stopServerActions', () => {
        test('returns false when redirect is false', () => {
            const props = { httpResponse: { redirect: false } };
            expect(action.stopServerActions(props)).toBe(false);
        });

        test('returns true when redirect is not false', () => {
            const props = { httpResponse: { redirect: '/world' } };
            expect(action.stopServerActions(props)).toBe(true);
        });
    });

    describe('staticMethod', () => {
        test('does not overwrite existing redirect', () => {
            action = redirectAction({ to: () => '/hello' });
            const props = { httpResponse: { redirect: '/world' } };

            action.staticMethod(props);

            expect(props.httpResponse.redirect).toBe('/world');
        });

        test('does not assign redirect when condition not met', () => {
            action = redirectAction({ to: ({ condition }) => condition ? '/hello' : false });
            const props = { httpResponse: { redirect: false }, condition: false };

            action.staticMethod(props);
            expect(props.httpResponse.redirect).toBe(false);
        });

        test('assigns a redirect and statusCode', () => {
            action = redirectAction({ to: () => '/hello' });
            const props = { httpResponse: { redirect: false } };

            action.staticMethod(props);
            expect(props.httpResponse.redirect).toBe('/hello');
        });
    });
});
