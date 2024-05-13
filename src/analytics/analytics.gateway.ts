import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
import { Server } from 'socket.io';
import axios from 'axios';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@WebSocketGateway()
export class AnalyticsGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly analyticsService: AnalyticsService) {}
  onModuleInit() {
    this.server.on(`connection`, (socket) => {
      console.log(socket.id);
      console.log(`Connected`);
    });
  }

  afterInit(server: Server) {
    console.log("WebSocket gateway initialized 0000");
    console.log("WebSocket gateway initialized 0000", 3000);
  }

  handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage("subscribeToData")
  async handleSubscribeToData(client: any, data: any): Promise<any> {
    const result = await this.getDataFromExternalAPI();
    return this.server.emit("dataUpdated", result);
    // return result;
  }

  private async getDataFromExternalAPI(): Promise<any> {
    try {
      const apiKey = `5VDYGHGDQANUYHIO`;
      const symbol = "AAPL"; // Symbol for Apple Inc.

      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`
      );
      const data = response.data;
      // console.log(data); // Log the fetched data
      // Process the data as needed
      return data;
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  }
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage("createAnalytics")
  create(@MessageBody() createAnalyticsDto: CreateAnalyticsDto) {
    return this.analyticsService.create(createAnalyticsDto);
  }
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage("findAllAnalytics")
  findAll() {
    return this.analyticsService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage("findOneAnalytics")
  findOne(@MessageBody() id: number) {
    return this.analyticsService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage("updateAnalytics")
  update(@MessageBody() updateAnalyticsDto: UpdateAnalyticsDto) {
    return this.analyticsService.update(
      updateAnalyticsDto.id,
      updateAnalyticsDto
    );
  }
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage("removeAnalytics")
  remove(@MessageBody() id: number) {
    return this.analyticsService.remove(id);
  }
}
