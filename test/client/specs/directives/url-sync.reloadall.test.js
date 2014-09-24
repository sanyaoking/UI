describe("Directive: url-sync.reloadAll()", function () {

    var scope, element, compile, clock;
    beforeEach(module("BrowserSync"));
    beforeEach(module("test.templates"));

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($compile, $rootScope) {
        scope = $rootScope;
        compile = $compile;
        clock = sinon.useFakeTimers();
    }));

    after(function () {
        clock.restore();
    });

    describe("Syncing URLS", function () {

        var socket, rootScope;

        beforeEach(inject(function (Socket, $rootScope) {

            socket = Socket;
            rootScope = $rootScope;

            // Set the user on the parent scope to simulate how it'd happen in your app
            scope.options = {
                server: {
                    baseDir: "./"
                },
                "urls": {
                    "local": "http://localhost:3000",
                    "external": "http://192.168.0.2:3000",
                    "tunnel": "https://trjjcleffl.localtunnel.me"
                }
            };

            // Pass in the user object to the directive
            element = angular.element("<url-sync options=\"options\"></url-sync>");

            // Compile & Digest as normal
            compile(element)(scope);
            scope.$digest();
        }));

        it("has a sendAllTo() method", function () {
            var isolatedScope = scope.$$childHead;
            assert.deepEqual(typeof isolatedScope.sendAllTo, "function");
        });
        it("Emits the browser:url event", function () {
            var isolatedScope = scope.$$childHead;

            var stub = sinon.spy(socket, "emit");

            isolatedScope.sendAllTo("about-us.html");

            sinon.assert.calledWithExactly(stub, "cp:browser:url", {
                url: "about-us.html"
            });

            stub.reset();
        });
//        it("Emits the reload-all event", function (done) {
//
//            var stub = sinon.spy(socket, "emit");
//            var isolatedScope = scope.$$childHead;
//
//            // Tests finished if this event happens
//            rootScope.$on("notify:flash", function () {
//                done();
//            });
//
//            // Run the method
//            isolatedScope.reloadAll();
//
//            // Should set the UI
//            assert.equal(isolatedScope.ui.loading, true);
//
//            // Ensure socket event is called
//            sinon.assert.calledWithExactly(stub, "cp:browser:reload");
//
//            // Restore the clock
//            clock.tick(600);
//
//            // Ensure UI is reset
//            assert.equal(isolatedScope.ui.loading, false);
//        });
    });
});