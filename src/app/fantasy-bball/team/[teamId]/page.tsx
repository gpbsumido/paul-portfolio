import { getTeamInfo } from "@/lib/espnService";

interface TeamPageProps {
    params: {
        teamId: string;
    };
}

export default async function TeamPage({ params }: TeamPageProps) {
    const data = await getTeamInfo(params.teamId);
    const team = data.teams[0];
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{team.name}</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Team Information</h2>
                <p className="text-gray-600 mb-2">Owner: {team.owners[0].displayName}</p>
                <p className="text-gray-600">Record: {team.record.overall.wins}-{team.record.overall.losses}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Roster</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {team.roster.entries.map((entry: any) => (
                                <tr key={entry.playerId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {entry.playerPoolEntry.player.fullName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {entry.playerPoolEntry.player.defaultPosition}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {entry.playerPoolEntry.player.injuryStatus || 'Active'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 