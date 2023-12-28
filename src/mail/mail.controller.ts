import { Job } from './../job/schemas/job.schema';
import { Subscriber } from './../subscribers/schemas/subscriber.schema';
import { Public, ResponseMessage } from './../decorator/customize';
import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { SubscriberDocument } from 'src/subscribers/schemas/subscriber.schema';
import { JobDocument } from 'src/job/schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    private mailerService: MailerService,

    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,

    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {
  }

  @Get()
  @Public()
  @ResponseMessage("Test email")
  // async handleTestEmail() {
  // const jobs = [
  //   {
  //     name: "abc job",
  //     company: "Quang Ney",
  //     salary: "5000",
  //     skills: ["React", "Node.js"],
  //   },
  //   {
  //     name: "abc job222",
  //     company: "Q Ney222",
  //     salary: "5000",
  //     skills: ["React", "Node.js"],
  //   },
  // ]

  // const subscribers = await this.subscriberModel.find({});
  // for (const subs of subscribers) {
  //   const subsSkills = subs.skills;
  //   const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } }); //todo
  //   if (jobWithMatchingSkills?.length) {
  //     const jobs = jobWithMatchingSkills.map(item => {
  //       return {
  //         name: item.name,
  //         company: item.company.name,
  //         salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
  //         skills: item.skills
  //       }
  //     })

  // await this.mailerService.sendMail({
  //   to: "quangney.dev@gmail.com",
  //   from: '"Support Team" <support@example.com>', // override default from
  //   subject: 'Welcome to Nice App! Confirm your Email',
  //   // html: '<b>Welcome</b>',
  //   template: "new-job",
  //   context: {
  //     receiver: subs.name,
  //     jobs: jobs
  //   }
  // })
  //   }
  // }

  // await this.mailerService.sendMail({
  //   to: "quangney.dev@gmail.com",
  //   from: '"Support Team" <support@example.com>', // override default from
  //   subject: 'Welcome to Nice App! Confirm your Email',
  //   // html: '<b>Welcome</b>',
  //   template: "new-job",
  //   context: {
  //     receiver: "Q",
  //     jobs: jobs
  //   }
  // })
  // }

  async handleTestEmail() {
    const jobs = [
      {
        name: "abc job",
        company: "NeyX",
        salary: "5000",
        skills: ["React", "NodeJS"]
      },
      {
        name: "abc job s2",
        company: "NeyX",
        salary: "5000",
        skills: ["React", "NodeJS"]
      },
    ]

    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({ skills: { $in: subsSkills } });
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map(item => {
          return {
            name: item.name,
            company: item.company.name,
            salary: `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + " đ",
            skills: item.skills
          }
        })

        await this.mailerService.sendMail({
          to: "quangney.dev@gmail.com",
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: "new-job",
          context: {
            receiver: subs.name,
            jobs: jobs,
          }
        });
      }
    }

  }
}
