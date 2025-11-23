import ForecastClient from "@/components/forecast/forecast-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForecastPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Sales Forecast Tool</CardTitle>
                    <CardDescription>
                        Use historical data and market trends to predict future sales using AI.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ForecastClient />
                </CardContent>
            </Card>
        </div>
    )
}
