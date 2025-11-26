
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Workflow } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-4">
            <BookOpen className="h-10 w-10 text-primary" />
            <div>
              <CardTitle className="text-3xl">Support & Documentation</CardTitle>
              <CardDescription className="text-lg">
                Your guide to mastering the EuroBiz ERP system.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to the EuroBiz ERP documentation. This guide is designed to help you understand and utilize all the features of the system to manage your business operations effectively. Use the sections below to navigate to the specific module you need help with.
          </p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
           <div className="flex items-center gap-4">
             <Workflow className="h-8 w-8 text-primary" />
            <div>
                <CardTitle>End-to-End Business Workflow</CardTitle>
                <CardDescription>
                    Follow this step-by-step guide to run your entire business process within the system.
                </CardDescription>
            </div>
           </div>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
            <li>
              <h4 className="font-semibold text-foreground inline">Add Suppliers</h4>
              <p className="pl-2">Go to the **Suppliers** page and add the businesses you purchase raw materials from. This is the first step in setting up your supply chain.</p>
            </li>
            <li>
              <h4 className="font-semibold text-foreground inline">Add Raw Materials</h4>
              <p className="pl-2">On the **Raw Materials** page, define all the materials you use in production. Set their name, category, and unit (e.g., kg, litre). Initial quantity and cost can be set to 0, as they will be updated by purchase orders.</p>
            </li>
            <li>
              <h4 className="font-semibold text-foreground inline">Purchase Raw Materials</h4>
              <p className="pl-2">Navigate to **Purchase Orders** and create a new PO. Select a supplier and add the materials you wish to buy. When you mark the PO as "Received," the system automatically increases your raw material inventory and updates the average unit cost.</p>
            </li>
             <li>
              <h4 className="font-semibold text-foreground inline">Add Production Formulas</h4>
              <p className="pl-2">Go to **Settings &rarr; System**. Here, you must create a **Production Formula** for each finished good. This "recipe" tells the system which raw materials and in what quantities are needed to produce one unit of a product. The system uses this to calculate the unit cost automatically.</p>
            </li>
            <li>
              <h4 className="font-semibold text-foreground inline">Manufacture Products</h4>
              <p className="pl-2">On the **Production** page, create a new production order. Select the finished good and the quantity to produce. When you mark this order as "Completed," the system deducts the required raw materials from stock and adds the newly made products to your **Finished Goods** inventory.</p>
            </li>
             <li>
              <h4 className="font-semibold text-foreground inline">Add Distributors</h4>
              <p className="pl-2">Go to the **Distributors** page to add your customers or sales channels. You'll select from this list when creating a sale.</p>
            </li>
             <li>
              <h4 className="font-semibold text-foreground inline">Create a Sale</h4>
              <p className="pl-2">Navigate to **Sales** and create a new sale. Select a distributor and add the finished goods to be sold. The system calculates totals, applies any commission-based discounts, and generates an invoice. Upon saving, your finished goods inventory is automatically deducted.</p>
            </li>
             <li>
              <h4 className="font-semibold text-foreground inline">Manage Dues</h4>
              <p className="pl-2">Visit the **Outstanding Dues** page. The **Accounts Receivable** tab shows money owed by customers, while **Accounts Payable** shows money you owe to suppliers. You can record payments against invoices and purchase orders here.</p>
            </li>
            <li>
              <h4 className="font-semibold text-foreground inline">Handle Sales Returns</h4>
              <p className="pl-2">On the **Returns** page, you can process returns against an invoice. This action updates the invoice's due amount and adds the returned items back into your finished goods inventory.</p>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Module Guides</CardTitle>
          <CardDescription>
            Detailed work procedures for each module in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">Sales & Purchasing</AccordionTrigger>
              <AccordionContent className="pl-4">
                <Accordion type="single" collapsible>
                  <AccordionItem value="sub-1-1">
                    <AccordionTrigger>How to Create a New Sale</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>Navigate to the **Sales** page from the sidebar and click **Create Sale**.</li>
                        <li>Select a distributor from the dropdown menu.</li>
                        <li>Click **Add Item** to add a product to the invoice.</li>
                        <li>Select the product and adjust the quantity as needed. The selling price is populated automatically but can be edited.</li>
                        <li>Applicable commission-based discounts are calculated and applied automatically.</li>
                        <li>Enter the **Amount Paid** by the customer (if any). The **Due Amount** will update automatically.</li>
                        <li>Click **Generate Invoice** to save the sale. This updates stock levels and generates commission records.</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="sub-1-2">
                    <AccordionTrigger>How to Manage Purchase Orders (POs)</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>Go to the **Purchase Orders** page and click **Create Purchase Order**.</li>
                        <li>Select a supplier and add the raw materials you wish to purchase, specifying quantity and unit cost.</li>
                        <li>Add any discounts or taxes. The total and due amount are calculated automatically.</li>
                        <li>After saving, track the order's status (Pending, Shipped, Received).</li>
                        <li>When items arrive, find the PO and use the action menu to **Mark as Received**. This updates your raw material inventory and its weighted average cost.</li>
                        <li>Use the **Make Payment** action from the same menu to record payments against the PO.</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">Inventory & Production</AccordionTrigger>
              <AccordionContent className="pl-4">
                 <Accordion type="single" collapsible>
                  <AccordionItem value="sub-2-1">
                    <AccordionTrigger>How to Manage Production Formulas</AccordionTrigger>
                    <AccordionContent>
                       <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>Navigate to **Settings** from the sidebar.</li>
                        <li>Under the **System** tab, find the **Production Formulas** card.</li>
                        <li>Click **Add Formula** to define a new finished good.</li>
                        <li>Give the product a name and add each raw material component with its required quantity.</li>
                        <li>The system automatically calculates the **Unit Cost** based on the current cost of the raw materials.</li>
                        <li>Save the formula. This product will now be available for production orders.</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="sub-2-2">
                    <AccordionTrigger>How to Create a Production Order</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>Go to the **Production** page and click **New Production**.</li>
                        <li>Select the finished good and the quantity to produce.</li>
                        <li>The system calculates the required **Material Cost** based on the formula. Enter any additional costs like labour or wastage.</li>
                        <li>The **Total Production Cost** and final **Cost Per Unit** are calculated in real-time.</li>
                        <li>Save the order. It will appear in the list with a "Pending" status.</li>
                        <li>When production is finished, use the action menu to **Mark as Complete**. This deducts the used raw materials from inventory and adds the new finished goods to stock.</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-semibold">Financials</AccordionTrigger>
              <AccordionContent className="pl-4">
                 <Accordion type="single" collapsible>
                  <AccordionItem value="sub-3-1">
                    <AccordionTrigger>How to Manage Dues (Receivables & Payables)</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground mb-2">The **Outstanding Dues** page provides a centralized view of money you owe (Payables) and money owed to you (Receivables).</p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>**Accounts Receivable**: This tab lists all customer invoices with a balance due. Click **Record Payment** to enter a payment received from a customer, which updates the invoice status.</li>
                        <li>**Accounts Payable**: This tab lists all purchase orders with an outstanding balance. Click **Make Payment** to record payments made to your suppliers.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="sub-3-2">
                    <AccordionTrigger>How to Manage Salary Payments</AccordionTrigger>
                    <AccordionContent>
                       <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li>Navigate to the **Salaries** page.</li>
                        <li>Click **Record Payment**.</li>
                        <li>In the dialog, enter the employee's name, position, payment date, and the total amount paid.</li>
                        <li>Click **Save Record**. The payment will be added to the history table.</li>
                        <li>You can **Edit** or **Delete** any payment record from the action menu.</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </AccordionContent>
            </AccordionItem>

             <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-semibold">Settings</AccordionTrigger>
              <AccordionContent className="pl-4">
                 <p className="text-muted-foreground">
                    The **Settings** page allows administrators to configure system-wide parameters and business rules. Here you can manage your user profile, change passwords, set the system currency, and define core business logic like **Production Formulas** and **Commission Rules**. Any rules defined here are used globally in their respective modules.
                 </p>
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
