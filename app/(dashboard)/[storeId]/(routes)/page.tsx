import React from "react";
import Heading from "@/components/Heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, IndianRupee, Package } from "lucide-react";
import { formatter } from "@/lib/utils";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStockCount } from "@/actions/get-stock-count";
import Overview from "@/components/Overview";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getPaymentStatusRevenue } from "@/actions/get-graph-revenue-by-status";
import { getCategoryRevenue } from "@/actions/get-graph-category-revenue";
import { getOrderStatusTotalRevenue } from "@/actions/get-graph-order-status-revenue";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);
  const graphPaymentStatusRevenue = await getPaymentStatusRevenue(
    params.storeId
  );
  const graphCategoryRevenue = await getCategoryRevenue(params.storeId);
  const graphOrderStatusRevenue = await getOrderStatusTotalRevenue(
    params.storeId
  );

  return (
    <div className="flex-col p-4 md:p-8">
      <Heading title="Dashboard" description="Overview of your store" />
      <Separator className="my-4" />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Revenue */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatter.format(totalRevenue)}
            </div>
          </CardContent>
        </Card>

        {/* Sales Count */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{salesCount}</div>
          </CardContent>
        </Card>

        {/* Stock Count */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Products in Stock
            </CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockCount}</div>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 shadow-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>

        {/* Category Revenue */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-3 shadow-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Category Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphCategoryRevenue} />
          </CardContent>
        </Card>

        {/* Payment Status Revenue */}
        <Card className="col-span-1 shadow-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Payment Status Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphPaymentStatusRevenue} />
          </CardContent>
        </Card>

        {/* Order Status Revenue */}
        <Card className="col-span-1 shadow-lg">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Order Status Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphOrderStatusRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
