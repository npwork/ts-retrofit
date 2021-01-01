import { ServiceBuilder } from "../../../src/service.builder";
import { JSONPLACEHOLDER_URL } from "../../testHelpers";
import { NoHttpMethodService, WrongHeaderService, WrongQueryService } from "../../fixture/fixtures.wrong-cases";
import { ErrorMessages } from "../../../src";

describe("Decorators - wrong cases", () => {
  describe("Headers", () => {
    const service = new ServiceBuilder().setEndpoint(JSONPLACEHOLDER_URL).build(WrongHeaderService);

    describe("@HeaderMap", () => {
      test("Empty header key", async () => {
        await verifyErrorThrown(async () => {
          await service.wrongHeaderMap({
            "": "hello",
          });
        }, ErrorMessages.EMPTY_HEADER_KEY);
      });

      test("Wrong child property type", async () => {
        await verifyErrorThrown(async () => {
          await service.wrongHeaderMap({
            H1: "hello",
            H2: {
              I1: "asd",
            },
          });
        }, ErrorMessages.WRONG_HEADERS_PROPERTY_TYPE);
      });
    });

    describe("@Header", () => {
      test("Wrong property type", async () => {
        await verifyErrorThrown(async () => {
          await service.wrongHeaderType({
            a: "1",
            b: 2,
          });
        }, ErrorMessages.WRONG_HEADER_TYPE);
      });

      test("Empty header key", async () => {
        await verifyErrorThrown(async () => {
          await service.emptyHeaderKey("");
        }, ErrorMessages.EMPTY_HEADER_KEY);
      });
    });
  });

  describe("Query params", () => {
    const service = new ServiceBuilder().setEndpoint(JSONPLACEHOLDER_URL).build(WrongQueryService);

    describe("@QueryMap", () => {
      test("Empty header key", async () => {
        await verifyErrorThrown(async () => {
          await service.wrongQueryMap({
            "": "hello",
          });
        }, ErrorMessages.EMPTY_QUERY_KEY);
      });

      test("Wrong @QueryMap property type", async () => {
        await verifyErrorThrown(async () => {
          await service.wrongQueryMap({
            H1: "hello",
            H2: {
              I1: "asd",
            },
          });
        }, ErrorMessages.WRONG_QUERY_MAP_PROPERTY_TYPE);
      });
    });

    describe("@Query", () => {
      test("Wrong property type", async () => {
        await verifyErrorThrown(async () => {
          await service.wrongQuery({
            a: "1",
            b: 2,
          });
        }, ErrorMessages.WRONG_QUERY_TYPE);
      });

      test("Empty header key", async () => {
        await verifyErrorThrown(async () => {
          await service.emptyQueryKey("");
        }, ErrorMessages.EMPTY_QUERY_KEY);
      });
    });
  });

  describe("No Http decorator", () => {
    const noHttpMethodService = new ServiceBuilder().setEndpoint(JSONPLACEHOLDER_URL).build(NoHttpMethodService);

    describe("Works fine with not decorated methods", () => {
      test("No params", async () => {
        expect(await noHttpMethodService.validMethodNoParams()).toBe(100);
      });
      test("1 param", async () => {
        expect(await noHttpMethodService.validMethodWithOneParam("abc")).toBe("abc");
      });

      test("2 params", async () => {
        expect(await noHttpMethodService.validMethodWithTwoParams("abc", "cba")).toBe("abccba");
      });
    });

    test("With @Path", async () => {
      await verifyErrorThrown(async () => {
        await noHttpMethodService.path(1);
      }, ErrorMessages.NO_HTTP_METHOD);
    });

    test("With @Headers", async () => {
      await verifyErrorThrown(async () => {
        await noHttpMethodService.headers();
      }, ErrorMessages.NO_HTTP_METHOD);
    });

    test("With @Queries", async () => {
      await verifyErrorThrown(async () => {
        await noHttpMethodService.queries();
      }, ErrorMessages.NO_HTTP_METHOD);
    });

    test("With @FormUrlEncoded", async () => {
      await verifyErrorThrown(async () => {
        await noHttpMethodService.formUrlEncoded();
      }, ErrorMessages.NO_HTTP_METHOD);
    });

    test("With @Field", async () => {
      await verifyErrorThrown(async () => {
        await noHttpMethodService.field(12);
      }, ErrorMessages.NO_HTTP_METHOD);
    });

    test("With @ResponseStatus", async () => {
      await verifyErrorThrown(async () => {
        await noHttpMethodService.responseStatus();
      }, ErrorMessages.NO_HTTP_METHOD);
    });

    test("With @Config", async () => {
      await verifyErrorThrown(async () => {
        await noHttpMethodService.config();
      }, ErrorMessages.NO_HTTP_METHOD);
    });
  });

  async function verifyErrorThrown(exec: () => {}, err: string) {
    try {
      await exec();
    } catch (e) {
      expect(e.message).toBe(err);
      return;
    }

    fail("No error");
  }
});