import { describe, expect, it } from "vitest";
import {
  employeeProfileUrl,
  idpUrl,
  talentMappingUrl,
  tdpUrl,
  teamProfileUrl,
  vismapUrl,
} from "./navigation";

describe("navigation URL builders", () => {
  it("builds the succession-risk vismap deep link verified live in Phase 0", () => {
    expect(vismapUrl({ tab: "succession-risk" })).toBe("/vismap?tab=succession-risk");
  });

  it("builds a vismap highlight+simulate link", () => {
    expect(vismapUrl({ highlight: "Sri Mulyani", simulateTargetPosition: "CEO" })).toBe(
      "/vismap?highlight=Sri+Mulyani&simulate=true&targetPosition=CEO"
    );
  });

  it("builds the tdp-view table deep link", () => {
    expect(tdpUrl({ tab: "table" })).toBe("/tdp-view?tab=table");
  });

  it("builds an idp deep link with page+id+name", () => {
    expect(idpUrl({ page: "detail-review-idp.html", id: "3", name: "Dewi Kusuma" })).toBe(
      "/idp?page=detail-review-idp.html&id=3&name=Dewi+Kusuma"
    );
  });

  it("builds an employee profile link with a required candidateId", () => {
    expect(employeeProfileUrl({ candidateId: "p01" })).toBe("/iprofile?id=p01");
    expect(employeeProfileUrl({ candidateId: "p01", from: "tdp" })).toBe("/iprofile?id=p01&from=tdp");
  });

  it("builds the talent-mapping box deep link verified live in Phase 0", () => {
    expect(talentMappingUrl({ box: 9 })).toBe("/talent-mapping?box=9");
    expect(talentMappingUrl()).toBe("/talent-mapping");
  });

  it("builds a talent-mapping highlight deep link", () => {
    expect(talentMappingUrl({ highlight: "Kylian Mbappe" })).toBe("/talent-mapping?highlight=Kylian+Mbappe");
  });

  it("builds the team-profile team+tab deep link verified live in Phase 0", () => {
    expect(teamProfileUrl({ teamId: "t1", tab: "interaction" })).toBe("/team-profile?team=t1&tab=interaction");
  });

  it("builds a team-profile highlight deep link", () => {
    expect(teamProfileUrl({ teamId: "t1", highlight: "Son Heung-min" })).toBe("/team-profile?team=t1&highlight=Son+Heung-min");
  });
});
