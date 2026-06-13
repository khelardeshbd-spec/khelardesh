declare module '@max-xoo/fotmob' {
  export default class Fotmob {
    constructor();
    getMatchesByDate(date: string): Promise<any>;
    getLeague(id: number, tab?: string, type?: string, timeZone?: string): Promise<any>;
    getAllLeagues(): Promise<any>;
    getTeam(id: number, tab?: string, type?: string, timeZone?: string): Promise<any>;
    getTeamSeasonStats(teamId: number, seasonId: number): Promise<any>;
    getPlayer(id: number): Promise<any>;
    getMatchDetails(matchId: number): Promise<any>;
    getWorldNews(options?: { page?: number; lang?: string }): Promise<any>;
    getTransfers(options?: { page?: number; lang?: string }): Promise<any>;
    request(path: string, params: Record<string, string>): Promise<any>;
  }
}
